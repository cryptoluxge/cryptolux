import axios from 'axios'
import { getPancakeBunnyContract, getPancakeProfileContract, getPancakeSquadContract } from './contractHelpers'
import { getUserCakeBalance } from './Helpers'

const profileContract = getPancakeProfileContract()

export const getUserIsRegistered = async (account) => {
  const hasRegistered = await profileContract.methods.hasRegistered(account).call()

  return hasRegistered
}

export const getStatusOfUser = async (account) => {
  const userStatus = await profileContract.methods.getUserStatus(account).call()
  return userStatus
}

export const getNumberOfActiveProfiles = async () => {
  const activeProfiles = await profileContract.methods.numberOfActiveProfiles().call()
  return Number(activeProfiles)
}

export const getTeam = async (id) => {
  const getTeamProfile = await profileContract.methods.getTeamProfile(id).call()
  const teamName = getTeamProfile[0]
  const teamDescription = getTeamProfile[1]
  const teamNumberUsers = getTeamProfile[2]
  const teamNumberPoints = getTeamProfile[3]
  const teamIsJoinable = getTeamProfile[4]

  return { teamName, teamDescription, teamNumberUsers, teamNumberPoints, teamIsJoinable }
}

export const getProfileUsername = async (account) => {
  const username = axios(`https://profile.pancakeswap.com/api/users/${account}`)
    .then((response) => response.data.username)
    .catch(() => 'error')
  return username
}

export const getProfilePictureFor = async (account) => {
  const userData = await profileContract.methods.getUserProfile(account).call()
  const pictureURL = axios(`https://nft.pancakeswap.com/api/v1/collections/${userData[3]}/tokens/${userData[4]}`)
    .then((response) => response.data.data.image.original)
    .catch(() => 'error')

  return pictureURL
}

export const getProfilePictureURL = (collectionAddress, tokenId) => {
  const url = `https://nft.pancakeswap.com/api/v1/collections/${collectionAddress}/tokens/${tokenId}`
  return url
}

export const getUserAchievements = async (account) => {
  const achievements = fetch('https://api.thegraph.com/subgraphs/name/pancakeswap/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `{
				user(id: '${account.toLowerCase()}') {
					id
					totalPoints
					isActive
					points {
						id
						campaignId
						points
					}
				}
			}`,
    }),
  })
    .then((res) => res.json())
    .then((res) => res.data.user.points)

  return achievements
}

export const getProfileCreationTime = async (account) => {
  const date = axios(`https://profile.pancakeswap.com/api/users/${account}`)
    .then((response) => response.data.created_at)
    .catch(() => 'error')
  return date
}

export const getBunnyAndSquadBalance = async (account) => {
  const squadContract = getPancakeSquadContract()
  const bunnyContract = getPancakeBunnyContract()
  const squadBalance = await squadContract.methods.balanceOf(account).call()
  const bunnyBalance = await bunnyContract.methods.balanceOf(account).call()
  const balance = Number(squadBalance) + Number(bunnyBalance)
  return balance
}

export const getUserTeamBanner = async (account) => {
  const userData = await profileContract.methods.getUserProfile(account).call()
  const teamId = userData[2]
  const getTeamInfo = await getTeam(teamId)

  if (getTeamInfo.teamName === 'Chaotic Cakers') {
    return 'https://pancakeswap.finance/_next/image?url=%2Fimages%2Fteams%2Fcakers-banner.png&w=1080&q=75'
  } else if (getTeamInfo.teamName === 'Fearsome Flippers') {
    return 'https://pancakeswap.finance/_next/image?url=%2Fimages%2Fteams%2Fflippers-banner.png&w=1920&q=75'
  } else {
    return 'https://pancakeswap.finance/_next/image?url=%2Fimages%2Fteams%2Fstorm-banner.png&w=1920&q=75'
  }
}

export const getUserPoints = async (account) => {
  const isRegistered = await getUserIsRegistered(account)
  if (isRegistered) {
    const userData = await profileContract.methods.getUserProfile(account).call()
    const points = userData[1]
    return { isRegistered, points: points }
  } else {
    return { isRegistered, points: 0 }
  }
}

export const getUserData = async (account) => {
  const isRegistered = await getUserIsRegistered(account)
  const cakeBalance = await getUserCakeBalance(account)
  if (isRegistered) {
    const userData = await profileContract.methods.getUserProfile(account).call()
    const userId = userData[0]
    const numberPoints = userData[1]
    const teamId = userData[2]
    const nftAddress = userData[3]
    const tokenId = userData[4]
    const isActive = userData[5]
    const userName = await getProfileUsername(account)
    const profilePicture = await getProfilePictureFor(account)
    const accountCreatedAt = await getProfileCreationTime(account)
    const userAchievements = []
    const nftBalance = await getBunnyAndSquadBalance(account)
    const teamBanner = await getUserTeamBanner(account)

    return { userName, userId, numberPoints, teamId, nftAddress, tokenId, isActive, isRegistered, profilePicture, accountCreatedAt, userAchievements, nftBalance, cakeBalance, teamBanner }
  } else {
    const teamBanner = 'https://pancakeswap.finance/_next/image?url=%2Fimages%2Fteams%2Fno-team-banner.png&w=1080&q=75'
    return { isRegistered, cakeBalance, teamBanner }
  }
}

export const getUserHasSquadProfile = async (account) => {
  const userData = await profileContract.methods.getUserProfile(account).call()
  const nftAddress = userData[3]
  const squad = nftAddress === '0x0a8901b0E25DEb55A87524f0cC164E9644020EBA' ? true : false
  return squad
}
